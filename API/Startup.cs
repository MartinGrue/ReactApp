﻿
using API.Middleware;
using Application.Activities;
using Domain;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Persistence;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Application.interfaces;
using Infrastructure.security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Application.User;
using AutoMapper;
using System;
using Infrastructure.photos;
using API.SignalR;
using System.Threading.Tasks;
using Application.Profiles;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Action<AuthorizationPolicyBuilder> configurePolicy = (authpolbuilder) => { authpolbuilder.Requirements.Add(new IsHostRequirement()); };
            // Action<AuthorizationOptions> configure = (authopt) => { authopt.AddPolicy("IsActivityHost", configurePolicy); };
            // Action<AuthorizationOptions> configure = (authopt) =>
            //  {
            //      authopt.AddPolicy("IsActivityHost", (authpolbuilder) =>
            //     {
            //         authpolbuilder.Requirements.Add(new IsHostRequirement());
            //     });
            //  };
            // Action<AuthorizationOptions> auth2 = (configure) => {};

            services.AddAuthorization(authopt =>
             {
                 authopt.AddPolicy("IsActivityHost", authpolbuilder =>
                {
                    authpolbuilder.Requirements.Add(new IsHostRequirement());
                });
             });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseLazyLoadingProxies();
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddMvc(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(cfg => cfg.RegisterValidatorsFromAssemblyContaining<Application.Activities.Create>())
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithOrigins("http://localhost:3000")
                    .AllowCredentials();
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddMediatR(typeof(CurrentUser.Handler).Assembly);
            services.AddAutoMapper(typeof(List.Handler).Assembly);

            var builder = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            services.AddSignalR();

            var key = new SymmetricSecurityKey(Encoding.UTF8.
            GetBytes("Super secret key"));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(Options =>
                {
                    Options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key
                    };
                    Options.Events = new JwtBearerEvents()
                    {
                        OnMessageReceived =
                         (MessageReceivedContext) =>
                         {
                             var accessToken = MessageReceivedContext.Request.Query["access_token"];
                             var path = MessageReceivedContext.Request.Path;
                             if (!string.IsNullOrEmpty(accessToken)
                                && path.StartsWithSegments("/chat"))
                             {
                                 MessageReceivedContext.Token = accessToken;
                             };
                             return Task.CompletedTask;
                         }
                    };
                }
               );

            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddScoped<IProfileReader, ProfileReader>();


            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();
            }
            else
            {
                // app.UseHsts();
            }

            // app.UseHttpsRedirection();
            app.UseAuthentication();
            // app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().AllowCredentials());
            app.UseCors("CorsPolicy");
            app.UseMvc();
            app.UseSignalR(configure => { configure.MapHub<ChatHub>("/chat"); });
        }
    }
}

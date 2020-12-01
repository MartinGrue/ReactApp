FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /app
# Copy csproj and restore as distinct layers
COPY ReactApp.sln ./

COPY Application ./Application
COPY Domain ./Domain
COPY Infrastructure ./Infrastructure
COPY Persistence ./Persistence
COPY API ./API

RUN dotnet restore

# Copy everything else and build
RUN dotnet publish -c Debug -o /out
FROM mcr.microsoft.com/dotnet/aspnet:3.1 as final
WORKDIR /app
COPY --from=build /out ./
WORKDIR /app

ENTRYPOINT ["dotnet", "API.dll"]

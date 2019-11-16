using System.Collections.Generic;
using Domain;
using Newtonsoft.Json;

namespace Application.Profiles
{
    public class Profile
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string UserName { get; set; }
        public string Image { get; set; }
        public ICollection<Photo> Photos { get; set; }        
        public bool isFollowed { get; set; }
        public int FollwersCount { get; set; }
        public int FollowingCount { get; set; }
    }
}
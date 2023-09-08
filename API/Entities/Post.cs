using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public int OwnerPostId { get; set; }
        public string Title { get; set; }
        public string ContentText { get; set; }
        public int AppUserId { get; set; } 
        public AppUser AppUser { get; set; }
        public List<Photo> Photos { get; set; } = new();
    }
}
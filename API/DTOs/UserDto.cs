using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class UserDto
    {
        public string Username { get; set; }
        public string Token { get; set; }
        public List<Post> Posts { get; set; } = new();
        public List<Photo> Photos { get; set; } = new();
    }
}
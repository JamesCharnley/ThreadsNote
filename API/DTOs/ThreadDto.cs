using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class ThreadDto
    {
        public List<Post> Posts { get; set; } = new();
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class PostDto
    {
        public int Id { get; set; }
        public int OwnerPostId { get; set; }
        public string Title { get; set; }
        public string ContentText { get; set; }
        public List<PhotoDto> Photos { get; set; } = new();
    }
}
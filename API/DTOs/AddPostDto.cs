using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class AddPostDto
    {
        public int OwnerPost { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }
}
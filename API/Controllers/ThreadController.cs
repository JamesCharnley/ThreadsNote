using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ThreadController : BaseApiController
    {
        private readonly IPhotoService _photoService;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        public ThreadController(IPhotoService photoService, IUserRepository userRepository, IMapper mapper, DataContext context)
        {
            _photoService = photoService;
            _userRepository = userRepository;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetThreads(int id)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if(user == null) {return Unauthorized();}

            var userWithPosts = await _context.Users.Include(p => p.Posts).SingleOrDefaultAsync(x => x.UserName == user.UserName);
            
            List<Post> posts = userWithPosts.Posts.Where(x => x.OwnerPostId == id).ToList();

            List<PostDto> dtos = new();
            foreach(Post p in posts){
                dtos.Add(_mapper.Map<PostDto>(p));
            }         
            return dtos;
        }

        [HttpGet("post/{id}")]
        public async Task<ActionResult<PostDto>> GetPost(int id)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if(user == null) {return Unauthorized();}

            var userWithPosts = await _context.Users.Include(p => p.Posts).SingleOrDefaultAsync(x => x.UserName == user.UserName);

            Post post = userWithPosts.Posts.Where(x => x.Id == id).Single();
            if(post == null){return BadRequest("Post with id " + id + " not found");}

            return _mapper.Map<PostDto>(post);
        }

        [HttpGet("thread-length/{id}")]
        public async Task<ActionResult<int>> GetThreadLength(int id)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if(user == null) {return Unauthorized();}
            var userWithPosts = await _context.Users.Include(p => p.Posts).SingleOrDefaultAsync(x => x.UserName == user.UserName);
            List<Post> posts = userWithPosts.Posts.Where(x => x.OwnerPostId == id).ToList();
            return posts.Count;
        }

        [HttpDelete("delete-post/{id}")]
        public async Task<ActionResult> DeletePost(int id)
        {
            
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if(user == null) {return Unauthorized();}
            
            var userWithPosts = await _context.Users.Include(p => p.Posts).SingleOrDefaultAsync(x => x.UserName == user.UserName);
            List<Post> postsToRemove = userWithPosts.Posts.Where(x => x.Id == id || x.OwnerPostId == id).ToList();
            
            foreach(Post p in postsToRemove)
            {
                userWithPosts.Posts.Remove(p);
            }
            if(await _userRepository.SaveAllAsync())
            {
                return Ok();
            }
            
            return BadRequest("Failed to save changes to database");
        }
        
        [HttpPost("add-post")]
        public async Task<ActionResult<int>> AddPost(AddPostDto postDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if(user == null) {return Unauthorized(); }
            Post newPost = new Post
            {
                OwnerPostId = postDto.OwnerPost,
                Title = postDto.Title,
                ContentText = postDto.Content
            };
            user.Posts.Add(newPost);

            if(await _userRepository.SaveAllAsync())
            {
                return user.Posts.Last().Id;
            }

            return BadRequest("Problem adding post");
        }

        [HttpPut("edit-post")]
        public async Task<ActionResult<int>> EditPost(EditPostDto changes)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if(user == null) { return Unauthorized();}

            var userWithPosts = await _context.Users.Include(p => p.Posts).SingleOrDefaultAsync(x => x.UserName == user.UserName);

            Post post = userWithPosts.Posts.Where(x => x.Id == changes.Id).SingleOrDefault();
            if(post == null){return BadRequest("Post does not exist");}
            if(post.Title == changes.Title && post.ContentText == changes.Content)
            {
                return BadRequest("No changes made to post");
            }
            if(post.Title != changes.Title)
            {
                post.Title = changes.Title;
            }
            if(post.ContentText != changes.Content)
            {
                post.ContentText = changes.Content;
            }
            //userWithPosts.Posts.Where(x => x.Id == changes.Id).SingleOrDefault().Title = changes.Title;
            //userWithPosts.Posts.Where(x => x.Id == changes.Id).SingleOrDefault().ContentText = changes.Content;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Something went wrong =(");
        }

        [HttpPost("add-photo/{id}")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(int id, IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if(user == null) { return Unauthorized();}

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                PostId = id
            };

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync()) return _mapper.Map<PhotoDto>(photo);

            return BadRequest("Problem adding photo");
        }
    }
}
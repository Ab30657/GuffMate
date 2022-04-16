
using System.Net.Mime;
using System.Linq;
using System;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using API.Helpers;

namespace API.SignalR
{
	public class GuffHub : Hub
	{
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IHubContext<PresenceHub> _presenceHub;
		private readonly PresenceTracker _tracker;
		private readonly IPhotoService _photoService;
		public GuffHub(IMapper mapper, IUnitOfWork unitOfWork, IHubContext<PresenceHub> presenceHub, PresenceTracker tracker, IPhotoService photoService)
		{
			_photoService = photoService;
			_tracker = tracker;
			_presenceHub = presenceHub;
			_unitOfWork = unitOfWork;
			_mapper = mapper;

		}
		public override async Task OnConnectedAsync()
		{
			var httpContext = Context.GetHttpContext();
			var otherUser = httpContext.Request.Query["user"].ToString();
			var userId = (await _unitOfWork.UserRepository.GetUserByUsernameAsync(otherUser)).Id;
			var guffParams = new GuffParams();
			var guffs = await _unitOfWork.GuffRepository.GetGuffsAsync(guffParams, userId);
			await Clients.Caller.SendAsync("ReceiveTimelineGuffs", guffs);
		}
		public async Task CreateGuff(CreateGuffDto guffDto)
		{
			var username = Context.User.GetUsername();

			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
			var guff = new Guff
			{
				User = user,
				GuffContent = guffDto.Content,

			};

			_unitOfWork.GuffRepository.AddGuff(guff);
			if (await _unitOfWork.GuffRepository.SaveAllAsync())
			{
				await Clients.Caller.SendAsync("NewGuff", _mapper.Map<GuffDto>(guff));
			}
		}

		public async Task LikeGuff(int id)
		{
			var username = Context.User.GetUsername();
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
			var guff = await _unitOfWork.GuffRepository.GetGuffAsync(id);
			if (await _unitOfWork.GuffRepository.GetLikeAsync(user.Id, id) != null) throw new HubException("Already liked the post!");
			var like = new UserLikeGuff
			{
				Guff = guff,
				User = user
			};
			_unitOfWork.GuffRepository.LikeGuff(like);
			if (await _unitOfWork.GuffRepository.SaveAllAsync())
			{
				await Clients.Caller.SendAsync("LikeGuff", _mapper.Map<LikeDto>(like));
			}
		}

		public async Task UnlikeGuff(int id)
		{
			var username = Context.User.GetUsername();
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
			if (await _unitOfWork.GuffRepository.GetLikeAsync(user.Id, id) == null) throw new HubException("Already unliked the post!");
			var like = await _unitOfWork.GuffRepository.GetLikeAsync(user.Id, id);
			_unitOfWork.GuffRepository.DeleteLike(like);
			if (await _unitOfWork.GuffRepository.SaveAllAsync())
			{
				await Clients.Caller.SendAsync("UnlikeGuff", _mapper.Map<LikeDto>(like));
			}
		}

		public async Task CreateComment(CreateCommentDto commentDto)
		{

			var username = Context.User.GetUsername();
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
			var guff = await _unitOfWork.GuffRepository.GetGuffAsync(commentDto.GuffId);
			var comment = new Comment
			{
				CommentUser = user,
				CommentPosted = DateTime.UtcNow,
				Content = commentDto.Content,
				Guff = guff
			};
			_unitOfWork.GuffRepository.AddComment(comment);
			if (await _unitOfWork.GuffRepository.SaveAllAsync())
			{
				await Clients.Caller.SendAsync("NewComment", _mapper.Map<CommentDto>(comment));
			}
		}
		public async Task DeleteComment(int id)
		{
			var username = Context.User.GetUsername();
			var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
			var guff = await _unitOfWork.GuffRepository.GetGuffAsync(id);
			_unitOfWork.GuffRepository.DeleteGuff(guff);

			if (await _unitOfWork.Complete())
			{
				await Clients.Caller.SendAsync("CommentDeleted");
			}
		}
	}
}
using System.Runtime.InteropServices;
using System.Reflection.Metadata.Ecma335;
using System.Linq;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
	public class AutoMapperProfiles : Profile
	{
		public AutoMapperProfiles()
		{
			CreateMap<AppUser, MemberDto>()
				.ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
				.ForMember(x => x.Interests, opt => opt.MapFrom(src => src.UserInterests.Select(x => x.Interest)));
			CreateMap<Photo, PhotoDto>();
			CreateMap<UserFriend, FriendDto>()
				.ForMember(x => x.Username, opt => opt.MapFrom(src => src.ReqReceiverUser.UserName))
				.ForMember(x => x.Name, opt => opt.MapFrom(src => src.ReqReceiverUser.Name))
				.ForMember(x => x.Gender, opt => opt.MapFrom(sourceMember => sourceMember.ReqReceiverUser.Gender))
				.ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.ReqReceiverUser.Photos.FirstOrDefault(x => x.IsMain).Url))
				.ForMember(x => x.Status, opt => opt.MapFrom(src => src.RequestStatus));
			CreateMap<Interest, InterestDto>();
			CreateMap<RegisterDto, AppUser>();
			CreateMap<ProfileCompleteDto, AppUser>();
		}
	}
}
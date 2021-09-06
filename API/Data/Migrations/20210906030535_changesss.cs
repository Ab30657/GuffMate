using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class changesss : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Friends_AspNetUsers_FriendOneId",
                table: "Friends");

            migrationBuilder.DropForeignKey(
                name: "FK_Friends_AspNetUsers_FriendTwoId",
                table: "Friends");

            migrationBuilder.RenameColumn(
                name: "FriendTwoId",
                table: "Friends",
                newName: "ReqReceiverUserId");

            migrationBuilder.RenameColumn(
                name: "FriendOneId",
                table: "Friends",
                newName: "ReqSenderUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Friends_FriendTwoId",
                table: "Friends",
                newName: "IX_Friends_ReqReceiverUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_AspNetUsers_ReqReceiverUserId",
                table: "Friends",
                column: "ReqReceiverUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_AspNetUsers_ReqSenderUserId",
                table: "Friends",
                column: "ReqSenderUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Friends_AspNetUsers_ReqReceiverUserId",
                table: "Friends");

            migrationBuilder.DropForeignKey(
                name: "FK_Friends_AspNetUsers_ReqSenderUserId",
                table: "Friends");

            migrationBuilder.RenameColumn(
                name: "ReqReceiverUserId",
                table: "Friends",
                newName: "FriendTwoId");

            migrationBuilder.RenameColumn(
                name: "ReqSenderUserId",
                table: "Friends",
                newName: "FriendOneId");

            migrationBuilder.RenameIndex(
                name: "IX_Friends_ReqReceiverUserId",
                table: "Friends",
                newName: "IX_Friends_FriendTwoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_AspNetUsers_FriendOneId",
                table: "Friends",
                column: "FriendOneId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_AspNetUsers_FriendTwoId",
                table: "Friends",
                column: "FriendTwoId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

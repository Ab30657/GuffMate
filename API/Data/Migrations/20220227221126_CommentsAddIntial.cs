using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class CommentsAddIntial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_AspNetUsers_CommenterId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_UserLikePost_AspNetUsers_UserId",
                table: "UserLikePost");

            migrationBuilder.DropForeignKey(
                name: "FK_UserLikePost_Guffs_GuffId",
                table: "UserLikePost");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserLikePost",
                table: "UserLikePost");

            migrationBuilder.RenameTable(
                name: "UserLikePost",
                newName: "Likes");

            migrationBuilder.RenameColumn(
                name: "CommenterId",
                table: "Comments",
                newName: "CommentUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_CommenterId",
                table: "Comments",
                newName: "IX_Comments_CommentUserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserLikePost_GuffId",
                table: "Likes",
                newName: "IX_Likes_GuffId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Likes",
                table: "Likes",
                columns: new[] { "UserId", "GuffId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_AspNetUsers_CommentUserId",
                table: "Comments",
                column: "CommentUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_AspNetUsers_UserId",
                table: "Likes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Guffs_GuffId",
                table: "Likes",
                column: "GuffId",
                principalTable: "Guffs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_AspNetUsers_CommentUserId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Likes_AspNetUsers_UserId",
                table: "Likes");

            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Guffs_GuffId",
                table: "Likes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Likes",
                table: "Likes");

            migrationBuilder.RenameTable(
                name: "Likes",
                newName: "UserLikePost");

            migrationBuilder.RenameColumn(
                name: "CommentUserId",
                table: "Comments",
                newName: "CommenterId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_CommentUserId",
                table: "Comments",
                newName: "IX_Comments_CommenterId");

            migrationBuilder.RenameIndex(
                name: "IX_Likes_GuffId",
                table: "UserLikePost",
                newName: "IX_UserLikePost_GuffId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserLikePost",
                table: "UserLikePost",
                columns: new[] { "UserId", "GuffId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_AspNetUsers_CommenterId",
                table: "Comments",
                column: "CommenterId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserLikePost_AspNetUsers_UserId",
                table: "UserLikePost",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserLikePost_Guffs_GuffId",
                table: "UserLikePost",
                column: "GuffId",
                principalTable: "Guffs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

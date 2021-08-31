using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class FriendRequestEntityAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Friends",
                columns: table => new
                {
                    ReqSenderUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    ReqReceiverUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    RequestStatus = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friends", x => new { x.ReqSenderUserId, x.ReqReceiverUserId });
                    table.ForeignKey(
                        name: "FK_Friends_AspNetUsers_ReqReceiverUserId",
                        column: x => x.ReqReceiverUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Friends_AspNetUsers_ReqSenderUserId",
                        column: x => x.ReqSenderUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Friends_ReqReceiverUserId",
                table: "Friends",
                column: "ReqReceiverUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Friends");
        }
    }
}

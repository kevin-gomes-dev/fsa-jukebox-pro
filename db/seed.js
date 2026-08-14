import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const userCount = 2;
  for (let i = 0; i < userCount; i++) {
    const username = "user" + i;
    const password = "a";
    const user = await createUser(username, password);
    console.log(user);
  }
  for (let i = 1; i <= 20; i++) {
    const playlist = await createPlaylist(
      "Playlist " + i,
      "lorem ipsum playlist description",
      i % 2 === 0 ? 1 : 2,
    );
    console.log(playlist);
  }
  // For logging, separate loops
  for (let i = 1; i <= 20; i++) {
    const track = await createTrack("Track " + i, i * 50000);
    console.log(track);
  }
  for (let i = 1; i <= 15; i++) {
    const playlistId = i > 8 ? 1 : 2;
    const playlistTrack = await createPlaylistTrack(playlistId, i);
    console.log(playlistTrack);
  }
}

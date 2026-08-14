import db from "#db/client";

export async function createPlaylist(name, description, userId) {
  const sql = `
  INSERT INTO playlists
    (name, description,user_id)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [name, description, userId]);
  return playlist;
}

export async function getPlaylists(userId) {
  const sql = `
  SELECT playlists.*
  FROM playlists
  WHERE user_id = $1
  `;
  const { rows: playlists } = await db.query(sql, [userId]);
  return playlists;
}

export async function getPlaylistById(id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE id = $1
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}

export async function getPlaylistsByTrackId(id) {
  const sql = `
  SELECT playlists.* FROM playlists
  JOIN playlists_tracks ON playlists_tracks.playlist_id = playlists.id
  JOIN tracks ON tracks.id = playlists_tracks.track_id
  WHERE tracks.id = $1`;
  const { rows: playlists } = await db.query(sql, [id]);
  return playlists;
}

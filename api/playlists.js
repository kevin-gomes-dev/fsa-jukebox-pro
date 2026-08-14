import express from "express";
const router = express.Router();
export default router;

import { createPlaylist, getPlaylistById, getPlaylists } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";
// import { verifyToken } from "#utils/jwt";
// import getUserFromToken from "#middleware/getUserFromToken";

router.use(requireUser);
router.get("/", async (req, res) => {
  const playlists = await getPlaylists(req.user.id);
  res.status(200).send(playlists);
});

router.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");
  const userId = req.user.id;
  const { name, description } = req.body;
  if (!name || !description || !userId)
    return res.status(400).send("Request body requires: name, description, user_id");

  const playlist = await createPlaylist(name, description, userId);
  res.status(201).send(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id, req.user.id);
  if (!playlist) return res.status(404).send("Playlist not found.");
  if (req.user.id !== playlist.user_id) return res.status(403).send("Playlist not owned by user.");
  req.playlist = playlist;
  next();
});

router.get("/:id", (req, res) => {
  res.status(200).send(req.playlist);
});

router.get("/:id/tracks", async (req, res) => {
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.status(200).send(tracks);
});

router.post("/:id/tracks", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("Request body requires: trackId");

  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});

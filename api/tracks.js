import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";
import getUserFromToken from "#middleware/getUserFromToken";
import { getPlaylistsByTrackId } from "#db/queries/playlists";

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.status(200).send(tracks);
});

router.get("/:id/playlists", requireUser, async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  const playlists = await getPlaylistsByTrackId(req.params.id);
  res.status(200).send(playlists.filter((playlist) => playlist.user_id === req.user.id));
});

router.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.status(200).send(track);
});

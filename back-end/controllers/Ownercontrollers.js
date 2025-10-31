// controllers/deviceOwnerController.js
import { setOwner, getOwnerByDevice, listDevicesByUser } from '../models/Owner.js';

// POST /api/devices/link  { nom_esp32 }
export const linkDeviceToCurrentUser = async (req, res) => {
  try {
    const { nom_esp32 } = req.body;
    if (!nom_esp32) return res.status(400).json({ error: 'nom_esp32 requis' });

    // req.user injecté par votre middleware JWT
    const id_user = req.user?.id;
    if (!id_user) return res.status(401).json({ error: 'Non authentifié' });

    const result = await setOwner(nom_esp32, id_user);
    res.json({ message: 'Device lié à l\'admin', ...result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/devices/:nom_esp32/owner
export const getDeviceOwner = async (req, res) => {
  try {
    const { nom_esp32 } = req.params;
    const owner = await getOwnerByDevice(nom_esp32);
    if (!owner) return res.status(404).json({ error: 'Aucun owner pour ce device' });
    res.json(owner);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/devices/mine
export const getMyDevices = async (req, res) => {
  try {
    const id_user = req.user?.id;
    if (!id_user) return res.status(401).json({ error: 'Non authentifié' });
    const list = await listDevicesByUser(id_user);
    res.json({ count: list.length, devices: list });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

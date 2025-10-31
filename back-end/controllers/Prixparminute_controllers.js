import { UpdatePrix ,getPrixByUser } from '../models/PrixParminutes.js';

export const Updateprix = async (req, res) => {
  try {  
    const { value } = req.body;
    const { id_user } = req.params;
   
    // Validation
    if (!value) return res.status(400).json({ error: "value requis" });

    // Mettre à jour le prix
    const updatedPrix = await UpdatePrix(id_user, value);

    res.json({
      message: "Prix mis à jour",
      prix: updatedPrix
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ Récupérer le prix d'un utilisateur
export const getPrix = async (req, res) => {
  try {
    const { id_user } = req.params;

    if (!id_user) return res.status(400).json({ error: "id_user requis" });

    const prix = await getPrixByUser(id_user);

    if (!prix) {
      return res.status(404).json({ error: "Prix non trouvé pour cet utilisateur" });
    }

    res.json({
      message: "Prix trouvé",
      prix
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const Lead = require("../models/Lead");

// Distribuir os leads para os escritórios
const distribuirLeads = async (req, res) => {
  try {
    const loteSize = req.body.loteSize;
    const offices = req.body.offices;

    if (!loteSize || !offices || offices.length === 0) {
      return res
        .status(400)
        .json({
          message: "O campo (loteSize) e (offices) devem ser preenchidos",
        });
    }

    // Busca os leads mais antigos com status 'A distribuir' limitando ao tamanho do lote
    const leads = await Lead.find({ status: "A distribuir" })
      .sort({ projectDate: 1 })
      .limit(loteSize);

    if (leads.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum lead disponível para distribuição." });
    }

    let totalLeadsDistributed = {};
    const distribution = {};
    const leadsPerOffice = Math.floor(leads.length / offices.length);
    const remainder = leads.length % offices.length;

    //Distribui os leads de forma balanceada
    offices.forEach((office, index) => {
      distribution[office] = leadsPerOffice + (index < remainder ? 1 : 0);
    });

    //Escolher aleatoriamente o primeiro escritório líder
    let currentLeader = offices[Math.floor(Math.random() * offices.length)];
    console.log(
      `O primeiro escritório líder foi escolhido aleatoriamente: ${currentLeader}`
    );

    //Classificar os leads com base na renda e aplicações
    leads.forEach((lead) => {
      if (lead.monthlyIncome >= 50000 || lead.applications >= 1000000) {
        lead.perfil = "PRIVATE";
      } else if (lead.monthlyIncome >= 8000 || lead.applications >= 90000) {
        lead.perfil = "ALTA RENDA";
      } else {
        lead.perfil = "VAREJO";
      }
    });

    //Ordenar os LEADS com base na prioridade: PRIVATE, ALTA RENDA, VAREJO
    leads.sort((a, b) => {
      const perfilOrder = { PRIVATE: 1, "ALTA RENDA": 2, VAREJO: 3 };
      return perfilOrder[a.perfil] - perfilOrder[b.perfil];
    });

    let officeCounts = { ...distribution };

    // Distribui os leads com base no escritório líder e a lógica de distribuição 
    leads.forEach((lead) => {
      if (officeCounts[currentLeader] > 0) {
        lead.office = currentLeader;
        officeCounts[currentLeader]--;
      } else {
        for (let office of offices) {
          if (officeCounts[office] > 0) {
            lead.office = office;
            officeCounts[office]--; 
            break;
          }
        }
      }
      lead.status = "Em distribuição";
    });

    //Salavar no BD
    await Lead.bulkWrite(
      leads.map((lead) => ({
        updateOne: {
          filter: { _id: lead._id },
          update: {
            $set: {
              office: lead.office,
              status: "Finalizado",
              perfil: lead.perfil,
            },
          },
        },
      }))
    );

    totalLeadsDistributed[`lote`] = leads;

    res.status(200).json(totalLeadsDistributed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao processar leads" });
  }
};

// Listar leads (Todos os leads || leads (status) -> "A distribuir" e "Finalizado")
const listarLeads = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {}; 

    const leads = await Lead.find(filter); 

    if (leads.length === 0) {
      return res.status(404).json({ message: "Nenhum lead encontrado com o status especificado." });
    }

    res.status(200).json(leads); 
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Erro ao buscar leads" });
  }
};


// Listar os leads distribuídos para um escritório específico
const listarLeadsPorEscritorio = async (req, res) => {
  try {
    const office = req.query.office; 
    if (!office) {
      return res.status(400).json({ message: "O parâmetro 'office' é obrigatório." });
    }

    const leads = await Lead.find({ office });

    if (!leads.length) {
      return res.status(404).json({
        message: `Nenhum lead encontrado para o escritório ${office}.`,
      });
    }

    res.status(200).json(leads); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar leads por escritório" });
  }
};


module.exports = { listarLeads, distribuirLeads, listarLeadsPorEscritorio };
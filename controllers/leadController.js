const Lead = require("../models/Lead");

//Escolher um escritorio aleatoriamente para começar a distibuição 
const officeAssignments = ['X', 'Y'];
let currentLeader = officeAssignments[Math.floor(Math.random() * officeAssignments.length)];

//Distribuir os leads para os escritórios
const distribuirLeads = async (req, res) => {
  try {
    const loteSize = req.body.loteSize || 5;
    const distribution = req.body.distribution || { X: 3, Y: 2 };

    let totalLeadsDistributed = {};
    let loteCount = 1; 

    while (true) {
      const leads = await Lead.find({ status: 'A distribuir' })
        .sort({ projectDate: 1 })
        .limit(loteSize);

      if (leads.length === 0) {
        break;
      }

      // Categorizar os leads baseadop em renda e investimento
      leads.forEach(lead => {
        if (lead.monthlyIncome >= 50000 || lead.applications >= 1000000) {
          lead.perfil = 'PRIVATE';
        } else if (lead.monthlyIncome >= 8000 || lead.applications >= 90000) {
          lead.perfil = 'ALTA RENDA';
        } else {
          lead.perfil = 'VAREJO';
        }
      });
      
      let officeCounts = Object.assign({}, distribution);

      // Distribuindo os leads baseado no escritório líder
      leads.forEach(lead => {
        if (officeCounts[currentLeader] > 0) {
          lead.office = currentLeader; 
          officeCounts[currentLeader]--;
        } else {
          for (let office of officeAssignments) {
            if (officeCounts[office] > 0) {
              lead.office = office;
              officeCounts[office]--;
              break;
            }
          }
        }

        //Atualiza o status da distribuição
        lead.status = 'Em distribuição';
      });

      // Salvando no banco de dados
      await Lead.bulkWrite(
        leads.map(lead => ({
          updateOne: {
            filter: { _id: lead._id },
            update: { $set: { office: lead.office, status: 'Finalizado', perfil: lead.perfil } }
          }
        }))
      );

      totalLeadsDistributed[`lote ${loteCount}`] = leads;

      // Alterna o líder para o próximo lote a ser distribuido
      currentLeader = currentLeader === 'X' ? 'Y' : 'X'; 
      loteCount++;
    }

    res.status(200).json(totalLeadsDistributed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao processar leads' });
  }
};

//Listar todos os leads já distribuídos
const listarLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar leads" });
  }
};

//Listar os leads distribuidos para um escritório específico
const listarLeadsPorEscritorio = async (req, res) => {
  try {
    const { office } = req.params;
    const leads = await Lead.find({ office });
    if (!leads.length) {
      return res
        .status(404)
        .json({
          message: `Nenhum lead encontrado para o escritório ${office}`,
        });
    }
    res.status(200).json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar leads por escritório" });
  }
};

module.exports = { listarLeads, distribuirLeads, listarLeadsPorEscritorio};

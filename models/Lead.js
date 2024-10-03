const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  monthlyIncome: {
    type: Number,
    required: true
  },
  applications: {
    type: Number,
    required: true
  },
  projectDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['A distribuir', 'Em distribuição', 'Finalizado'],
    default: 'A distribuir'
  },
  office: {
    type: String,
    enum: ['X', 'Y'],
    default: null
  },
  perfil: {
    type: String,
    enum: ['PRIVATE', 'ALTA RENDA', 'VAREJO'],
    default: 'VAREJO'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;

import axios from 'axios';

const API_BASE = 'https://deepshield-deepfake.onrender.com/api';

export const api = {
  // Auth
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  getMe: () => axios.get(`${API_BASE}/auth/me`),

  // Analyze
  analyzeMedia: (formData) => axios.post(`${API_BASE}/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAnalysisById: (id) => axios.get(`${API_BASE}/analysis/${id}`),
  updateNotes: (id, notes) => axios.put(`${API_BASE}/analysis/${id}/notes`, { notes }),
  getReportUrl: (id) => `${API_BASE}/analysis/${id}/report`,

  // History & Evidence
  getHistory: (params) => axios.get(`${API_BASE}/history`, { params }),
  deleteHistory: (id) => axios.delete(`${API_BASE}/history/${id}`),
  getEvidenceVault: (params) => axios.get(`${API_BASE}/evidence`, { params }),

  // Comparison Mode
  compareAnalyses: (video_a_id, video_b_id) => axios.post(`${API_BASE}/compare`, { video_a_id, video_b_id }),

  // Threat Intel & Models
  getThreatIntel: () => axios.get(`${API_BASE}/threat-intel`),
  getModelsInfo: () => axios.get(`${API_BASE}/models`),
  getAuditLogs: () => axios.get(`${API_BASE}/audit-logs`),

  // Backend Samples
  getBackendSamples: () => axios.get(`${API_BASE}/samples`),
  analyzeBackendSample: (sampleId) => axios.post(`${API_BASE}/samples/analyze-sample/${sampleId}`)
};

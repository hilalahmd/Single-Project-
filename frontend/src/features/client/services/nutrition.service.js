import axios from 'axios'
import API from '../../../shared/utils/api'

const API_URL = `${API}/nutrition`

export const getDailyLog = async (date) => {
  const response = await axios.get(`${API_URL}/${date}`, { withCredentials: true })
  return response.data
}

export const addMealItem = async (date, mealIndex, itemData) => {
  const response = await axios.post(`${API_URL}/${date}/meal/${mealIndex}`, itemData, { withCredentials: true })
  return response.data
}

export const updateWaterIntake = async (date, amount) => {
  const response = await axios.put(`${API_URL}/${date}/water`, { amount }, { withCredentials: true })
  return response.data
}

export const updateWaterGoal = async (date, goal) => {
  const response = await axios.put(`${API_URL}/${date}/water-goal`, { goal }, { withCredentials: true })
  return response.data
}

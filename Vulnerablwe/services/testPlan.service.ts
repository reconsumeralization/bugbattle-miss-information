
// services/testPlan.service.ts
import { apiClient } from './apiClient';
import { ApiTestPlan } from '../types/apiTypes';
import { ApiResponse, TestPlanType } from '../types';
import { MOCK_TEST_PLANS } from '../constants/testplans.constants'; // Assuming mock data is here

export const testPlanService = {
  getTestPlans: async (): Promise<ApiResponse<ApiTestPlan[]>> => {
    // Simulate API call
    // In a real app: return apiClient.get<ApiTestPlan[]>('/test-plans');
    console.log('[TestPlanService] Fetching test plans...');
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
    
    // Return mock data directly for simulation
    return { success: true, data: MOCK_TEST_PLANS as ApiTestPlan[] };
  },

  getTestPlanById: async (id: string): Promise<ApiResponse<ApiTestPlan>> => {
    console.log(`[TestPlanService] Fetching test plan by ID: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    const plan = MOCK_TEST_PLANS.find(p => p.id === id);
    if (plan) {
      return { success: true, data: plan as ApiTestPlan };
    } else {
      return { success: false, error: { message: `Test plan with ID ${id} not found.`} };
    }
  },

  saveTestPlan: async (planData: TestPlanType): Promise<ApiResponse<ApiTestPlan>> => {
    // Simulate API call
    // In a real app: if (planData.id) return apiClient.put<ApiTestPlan>(`/test-plans/${planData.id}`, planData);
    // else return apiClient.post<ApiTestPlan>('/test-plans', planData);
    console.log('[TestPlanService] Saving test plan:', planData);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock save operation
    const isUpdate = MOCK_TEST_PLANS.some(p => p.id === planData.id);
    let savedPlan: ApiTestPlan;
    if (isUpdate) {
      // This mock doesn't actually update the MOCK_TEST_PLANS array
      savedPlan = { ...planData } as ApiTestPlan;
       console.log(`[TestPlanService] Simulated update for plan ID: ${planData.id}`);
    } else {
      savedPlan = { ...planData, id: `tp_mock_${Date.now()}` } as ApiTestPlan;
       console.log(`[TestPlanService] Simulated create for new plan. New ID: ${savedPlan.id}`);
    }
    // Note: MOCK_TEST_PLANS in memory is not mutated here, this is just a response simulation.
    return { success: true, data: savedPlan };
  },
};

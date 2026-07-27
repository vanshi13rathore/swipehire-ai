"use client";

import React, { useState } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';
import { Button } from "@/components/shared";
import type { CareerGoal } from "@/lib/supabase/types";
import { createCareerGoal, updateCareerGoal } from "@/lib/supabase/analytics";

export function GoalsList({ initialGoals }: { initialGoals: CareerGoal[] }) {
  const [goals, setGoals] = useState<CareerGoal[]>(initialGoals);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newMetric, setNewMetric] = useState("Interviews");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newTitle.trim() || !newTarget) return;
    setLoading(true);
    try {
      const g = await createCareerGoal({
        title: newTitle,
        target_value: parseInt(newTarget) || 10,
        current_value: 0,
        metric: newMetric,
        is_completed: false
      });
      setGoals([g, ...goals]);
      setIsAdding(false);
      setNewTitle("");
      setNewTarget("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (goal: CareerGoal) => {
    try {
      const updated = await updateCareerGoal(goal.id, { is_completed: !goal.is_completed });
      setGoals(goals.map(g => g.id === goal.id ? updated : g));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      {goals.map(goal => {
        const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
        return (
          <div key={goal.id} className={`p-4 border rounded-xl ${goal.is_completed ? 'bg-secondary/5 border-border' : 'bg-background border-border shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggle(goal)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${goal.is_completed ? 'bg-success border-success text-success-foreground' : 'border-input hover:border-primary'}`}
                >
                  {goal.is_completed && <Check className="w-3 h-3" />}
                </button>
                <h4 className={`font-medium text-sm ${goal.is_completed ? 'line-through text-muted-foreground' : ''}`}>{goal.title}</h4>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-3">
              <div className={`h-full ${goal.is_completed ? 'bg-success' : 'bg-primary'}`} style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
              <span>{goal.current_value} {goal.metric}</span>
              <span>{goal.target_value} {goal.metric}</span>
            </div>
          </div>
        );
      })}

      {goals.length === 0 && !isAdding && (
        <div className="text-center py-6 text-sm text-muted-foreground">
          No goals set yet.
        </div>
      )}

      {isAdding ? (
        <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl space-y-3">
          <input 
            placeholder="Goal title (e.g. Apply to 30 jobs)" 
            className="w-full p-2 text-sm border rounded-md"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Target" 
              className="w-24 p-2 text-sm border rounded-md"
              value={newTarget}
              onChange={e => setNewTarget(e.target.value)}
            />
            <select 
              className="flex-1 p-2 text-sm border rounded-md bg-background"
              value={newMetric}
              onChange={e => setNewMetric(e.target.value)}
            >
              <option value="Applications">Applications</option>
              <option value="Interviews">Interviews</option>
              <option value="ATS Score">ATS Score</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd} disabled={loading || !newTitle || !newTarget}>
              {loading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              Save Goal
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" fullWidth onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Goal
        </Button>
      )}
    </div>
  );
}

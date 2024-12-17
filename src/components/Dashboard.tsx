import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Crown, Wifi, WifiOff } from 'lucide-react';
import { BonsaiCard } from './BonsaiCard';
import { AddTreeForm } from './AddTreeForm';
import { EditTreeForm } from './EditTreeForm';
import { useBonsaiStore } from '../store/bonsaiStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { AuthError } from './AuthError';

export function Dashboard() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTree, setEditingTree] = useState<string | null>(null);
  const { trees, addTree, updateTree, deleteTree, error, clearError, offline } = useBonsaiStore();
  const { getCurrentPlan } = useSubscriptionStore();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan.id !== 'hobby';
  const canAddMoreTrees = isSubscribed || trees.length < 3;

  useEffect(() => {
    if (location.state?.showAddForm) {
      setShowAddForm(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleTreeClick = (id: string) => {
    navigate(`/tree/${id}`);
  };

  const handleEditClick = (id: string) => {
    setEditingTree(id);
  };

  const handleAddTreeClick = () => {
    if (!canAddMoreTrees) {
      navigate('/pricing');
      return;
    }
    setShowAddForm(true);
  };

  const handleDeleteTree = async (id: string) => {
    await deleteTree(id);
    setEditingTree(null);
  };

  const treeBeingEdited = editingTree ? trees.find(t => t.id === editingTree) : null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">My Collection</h2>
        <div className="flex items-center space-x-4">
          {offline && (
            <div className="flex items-center text-amber-500 dark:text-amber-400">
              <WifiOff className="w-4 h-4 mr-1" />
              <span className="text-sm">Offline Mode</span>
            </div>
          )}
          {!isSubscribed && trees.length >= 3 && (
            <div className="text-sm text-bonsai-terra flex items-center">
              <Crown className="w-4 h-4 mr-1" />
              <span>Upgrade to add more trees</span>
            </div>
          )}
          <button 
            onClick={handleAddTreeClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              canAddMoreTrees
                ? 'bg-bonsai-green text-white hover:bg-bonsai-moss'
                : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400 cursor-not-allowed'
            }`}
            disabled={!canAddMoreTrees}
          >
            <Plus className="w-5 h-5" />
            <span>Add Tree</span>
          </button>
        </div>
      </div>

      {error && <AuthError />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trees.map(tree => (
          <BonsaiCard 
            key={tree.id} 
            tree={tree} 
            onClick={handleTreeClick}
            onEdit={handleEditClick}
          />
        ))}
        
        {trees.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No trees in your collection yet.</p>
            <button
              onClick={handleAddTreeClick}
              className="mt-4 text-bonsai-green hover:text-bonsai-moss transition-colors"
            >
              Add your first tree
            </button>
          </div>
        )}
      </div>

      {showAddForm && (
        <AddTreeForm 
          onClose={() => setShowAddForm(false)}
          onSubmit={async (formData) => {
            try {
              const createdTree = await addTree(formData, isSubscribed);
              if (!error) {
                setShowAddForm(false);
              }
              return createdTree;
            } catch (err) {
              console.error('Error adding tree:', err);
            }
          }}
        />
      )}

      {treeBeingEdited && (
        <EditTreeForm
          tree={treeBeingEdited}
          onClose={() => setEditingTree(null)}
          onSubmit={async (id, updates) => {
            try {
              await updateTree(id, updates);
              if (!error) {
                setEditingTree(null);
              }
            } catch (err) {
              console.error('Error updating tree:', err);
            }
          }}
          onDelete={handleDeleteTree}
        />
      )}
    </div>
  );
}
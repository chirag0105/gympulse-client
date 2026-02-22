import React, { useState, useEffect } from 'react';
import { getExercises } from '../services/api';
import ExerciseCard from '../components/exercises/ExerciseCard';
import { Input, Spinner } from '../components/ui';

const ExerciseLibrary = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');

    const muscleGroups = ['chest', 'back', 'shoulders', 'legs', 'arms', 'core'];

    useEffect(() => {
        const fetchExercises = async () => {
            setLoading(true);
            try {
                const data = await getExercises({
                    search: searchTerm || undefined,
                    muscleGroup: selectedMuscleGroup || undefined
                });

                if (data.success) {
                    setExercises(data.data);
                } else {
                    setExercises([]);
                }
            } catch (err) {
                console.error("Error fetching exercises", err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchExercises();
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedMuscleGroup]);

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Exercise Library</h2>
                    <p style={{ color: '#666', margin: 0 }}>Browse and search available gym exercises.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <Input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ minWidth: '200px' }}
                    />
                    <select
                        value={selectedMuscleGroup}
                        onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">All Regions</option>
                        {muscleGroups.map(group => (
                            <option key={group} value={group}>
                                {group.charAt(0).toUpperCase() + group.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Spinner />
                    <p style={{ marginTop: '1rem', color: '#666' }}>Loading exercises...</p>
                </div>
            ) : exercises.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <h4 style={{ color: '#666' }}>No exercises found</h4>
                    <p style={{ color: '#666', margin: 0 }}>Try changing your filters.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {exercises.map(exercise => (
                        <ExerciseCard key={exercise.id} exercise={exercise} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExerciseLibrary;

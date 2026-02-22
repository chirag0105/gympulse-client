import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkoutById, createWorkout, updateWorkout, getExercises } from '../services/api';
import { useToast, Button, Input, Card, Modal, Spinner } from '../components/ui';
import ExerciseCard from '../components/exercises/ExerciseCard';

const WorkoutBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [exercises, setExercises] = useState([]);

    // Modal state for exercise picking
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [libraryExercises, setLibraryExercises] = useState([]);
    const [fetchingLibrary, setFetchingLibrary] = useState(false);

    useEffect(() => {
        if (id) {
            fetchWorkoutDetails();
        }
    }, [id]);

    useEffect(() => {
        if (isModalOpen) {
            fetchLibraryExercises();
        }
    }, [isModalOpen, searchTerm]);

    const fetchWorkoutDetails = async () => {
        setLoading(true);
        try {
            const res = await getWorkoutById(id);
            if (res.success) {
                setName(res.data.name);
                setDescription(res.data.description || '');
                const formattedExercises = res.data.exercises.map(ex => ({
                    ...ex,
                    exerciseId: ex.exerciseId,
                    name: ex.exerciseDetails.name,
                }));
                setExercises(formattedExercises);
            }
        } catch (err) {
            showToast('Error loading workout', 'error');
            navigate('/pt/workouts');
        } finally {
            setLoading(false);
        }
    };

    const fetchLibraryExercises = async () => {
        setFetchingLibrary(true);
        try {
            const res = await getExercises({ search: searchTerm || undefined });
            if (res.success) {
                setLibraryExercises(res.data);
            }
        } catch (err) {
            console.error('Error fetching exercises');
        } finally {
            setFetchingLibrary(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name,
                description,
                exercises: exercises.map(ex => ({
                    exerciseId: ex.exerciseId,
                    sets: ex.sets || 3,
                    reps: ex.reps || 10,
                    weight: ex.weight || null,
                    rpe: ex.rpe || null,
                    restSeconds: ex.restSeconds || null,
                    notes: ex.notes || ''
                }))
            };

            if (id) {
                await updateWorkout(id, payload);
                showToast('Workout updated successfully', 'success');
            } else {
                await createWorkout(payload);
                showToast('Workout created successfully', 'success');
            }
            navigate('/pt/workouts');
        } catch (err) {
            showToast('Error saving workout', 'error');
        } finally {
            setSaving(false);
        }
    };

    const addExercise = (exercise) => {
        setExercises([...exercises, {
            exerciseId: exercise.id,
            name: exercise.name,
            sets: 3,
            reps: 10,
            weight: 0,
            rpe: 8,
            restSeconds: 60,
            notes: ''
        }]);
        setIsModalOpen(false);
    };

    const removeExercise = (index) => {
        const newEx = [...exercises];
        newEx.splice(index, 1);
        setExercises(newEx);
    };

    const moveExercise = (index, direction) => {
        const newEx = [...exercises];
        const swapIndex = index + direction;
        if (swapIndex < 0 || swapIndex >= newEx.length) return;

        const temp = newEx[index];
        newEx[index] = newEx[swapIndex];
        newEx[swapIndex] = temp;
        setExercises(newEx);
    };

    const handleExerciseChange = (index, field, value) => {
        const newEx = [...exercises];
        newEx[index][field] = value;
        setExercises(newEx);
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}><Spinner /></div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>{id ? 'Edit Workout' : 'Create Workout'}</h2>
                <Button variant="secondary" onClick={() => navigate('/pt/workouts')}>Cancel</Button>
            </div>

            <Card style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <form onSubmit={handleSave}>
                    <Input
                        label="Workout Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ marginBottom: '1rem' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem' }}>
                        <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4>Exercises</h4>
                        <Button type="button" onClick={() => setIsModalOpen(true)}>+ Add Exercise</Button>
                    </div>

                    {exercises.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '4px', marginBottom: '2rem' }}>
                            <p style={{ margin: 0, color: '#666' }}>No exercises added yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {exercises.map((ex, idx) => (
                                <Card key={idx} style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h5 style={{ margin: 0 }}>{idx + 1}. {ex.name}</h5>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button type="button" variant="secondary" onClick={() => moveExercise(idx, -1)} disabled={idx === 0}>↑</Button>
                                            <Button type="button" variant="secondary" onClick={() => moveExercise(idx, 1)} disabled={idx === exercises.length - 1}>↓</Button>
                                            <Button type="button" variant="danger" onClick={() => removeExercise(idx)}>Remove</Button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                        <Input label="Sets" type="number" value={ex.sets} onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)} required />
                                        <Input label="Reps" type="number" value={ex.reps} onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)} required />
                                        <Input label="Weight (kg)" type="number" step="0.5" value={ex.weight} onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)} />
                                        <Input label="RPE" type="number" min="1" max="10" value={ex.rpe} onChange={(e) => handleExerciseChange(idx, 'rpe', e.target.value)} />
                                        <Input label="Rest (sec)" type="number" value={ex.restSeconds} onChange={(e) => handleExerciseChange(idx, 'restSeconds', e.target.value)} />
                                    </div>
                                    <Input label="Notes" value={ex.notes} onChange={(e) => handleExerciseChange(idx, 'notes', e.target.value)} />
                                </Card>
                            ))}
                        </div>
                    )}

                    <Button type="submit" variant="primary" disabled={saving || !name || exercises.length === 0} style={{ width: '100%' }}>
                        {saving ? 'Saving...' : 'Save Workout'}
                    </Button>
                </form>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Exercise">
                <Input
                    placeholder="Search exercise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                />
                <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {fetchingLibrary ? <div style={{ textAlign: 'center' }}><Spinner /></div> : libraryExercises.map(ex => (
                        <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }}>
                            <div>
                                <strong>{ex.name}</strong> <small style={{ color: '#666' }}>({ex.muscleGroup})</small>
                            </div>
                            <Button variant="primary" onClick={() => addExercise(ex)}>Add</Button>
                        </div>
                    ))}
                    {!fetchingLibrary && libraryExercises.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#666' }}>No exercises found.</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default WorkoutBuilder;

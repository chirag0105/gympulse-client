import React from 'react';
import { Card, Badge, Button } from '../ui';

const ExerciseCard = ({ exercise, onSelect, selectLabel = "Add to Workout" }) => {
    const getMuscleGroupColor = (group) => {
        const colors = {
            chest: 'primary',
            back: 'info',
            shoulders: 'warning',
            legs: 'success',
            arms: 'danger',
            core: 'secondary'
        };
        return colors[group] || 'primary';
    };

    return (
        <Card className="h-100 d-flex flex-column exercise-card">
            {exercise.youtubeUrl && (
                <div className="ratio ratio-16x9 mb-3">
                    <iframe
                        src={exercise.youtubeUrl}
                        title={`${exercise.name} video`}
                        allowFullScreen
                        style={{ borderRadius: '0.5rem 0.5rem 0 0' }}
                    />
                </div>
            )}
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{exercise.name}</h5>
                    <Badge variant={getMuscleGroupColor(exercise.muscleGroup)}>
                        {exercise.muscleGroup}
                    </Badge>
                </div>

                <div className="d-flex gap-2 mb-3 text-muted small">
                    <span><strong>Diff:</strong> {exercise.difficulty}</span>
                    <span><strong>Equip:</strong> {exercise.equipment}</span>
                </div>

                <p className="card-text text-muted mb-4 flex-grow-1" style={{ fontSize: '0.9rem' }}>
                    {exercise.description}
                </p>

                {onSelect && (
                    <Button
                        variant="outline-primary"
                        className="w-100 mt-auto"
                        onClick={() => onSelect(exercise)}
                    >
                        {selectLabel}
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default ExerciseCard;

export const determineCondition = (healthData) => {
    if (!healthData) return 'General Health';

    if (healthData.heartRate > 120 || healthData.heartRate < 50) {
        return 'Cardiac Issue';
    }

    if (healthData.bloodPressure?.systolic > 180 || healthData.bloodPressure?.diastolic > 120) {
        return 'Hypertensive Crisis';
    }

    if (healthData.bloodPressure?.systolic < 90 || healthData.bloodPressure?.diastolic < 60) {
        return 'Hypotension';
    }

    if (healthData.glucose > 300 || healthData.glucose < 70) {
        return 'Diabetic Emergency';
    }

    if (healthData.heartRate > 100 || healthData.heartRate < 60) {
        return 'Heart Condition';
    }

    if (healthData.bloodPressure?.systolic > 140 || healthData.bloodPressure?.diastolic > 90) {
        return 'High Blood Pressure';
    }

    if (healthData.glucose > 180 || healthData.glucose < 80) {
        return 'Blood Sugar Concern';
    }

    return 'General Health';
};

export const determineStatus = (healthData) => {
    if (!healthData) return 'Stable';

    if (healthData.heartRate > 130 || healthData.heartRate < 45 ||
        healthData.bloodPressure?.systolic > 190 || healthData.bloodPressure?.diastolic > 130 ||
        healthData.bloodPressure?.systolic < 80 || healthData.bloodPressure?.diastolic < 50 ||
        healthData.glucose > 400 || healthData.glucose < 60) {
        return 'Critical';
    }

    if (healthData.heartRate > 95 || healthData.heartRate < 65 ||
        healthData.bloodPressure?.systolic > 130 || healthData.bloodPressure?.diastolic > 85 ||
        healthData.bloodPressure?.systolic < 100 || healthData.bloodPressure?.diastolic < 65 ||
        healthData.glucose > 150 || healthData.glucose < 90) {
        return 'Improving';
    }

    return 'Stable';
};
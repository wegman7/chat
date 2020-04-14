export const updateObject = (oldObject, updatedProperties) => {
    console.log('inside update object');
    return {
        ...oldObject,
        ...updatedProperties
    }
}
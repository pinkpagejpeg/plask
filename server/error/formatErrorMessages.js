function formatErrorMessages (errorMessages) {
    if(errorMessages.length === 1) return errorMessages
    if(errorMessages.length === 2) return errorMessages.join(' и ')

    return errorMessages.slice(0, -2).map(item => item + ', ') + errorMessages.slice(-2).join(' и ')
}

module.exports = formatErrorMessages
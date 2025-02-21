module.exports = async function (req, res, next) {
    try {
        const hcaptchaToken = req.body.hcaptchaToken

        if (!hcaptchaToken) {
            return res.status(400).json({ message: 'Капча не пройдена' })
        }

        next()
    } catch {
        return res.status(400).json({ message: 'Капча не пройдена' })
    }
}

module.exports = async function (req, res, next) {
    try {
        const hcaptchaToken = req.body.hcaptchaToken

        if (!hcaptchaToken) {
            return res.status(401).json({ message: { message: 'Капча не пройдена' } })
        }

        next()
    } catch (error) {
        return res.status(401).json({ message: { message: 'Капча не пройдена' } })
    }
}

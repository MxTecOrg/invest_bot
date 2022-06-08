const wallet = {
    cwallet: "",
    dwallet: ""
};

const UserModel = (DataTypes) => {
    return {
        user_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        chat_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        wallet: {
            type: DataTypes.STRING,
            defaultValue: JSON.stringify(wallet)
        },
        referrals: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        referredBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lang: {
            type: DataTypes.STRING,
            defaultValue: "es"
        },
        acclevel: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    }
}

module.exports = UserModel;

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
            defaultValue: ""
        },
        dep_wallet: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        balance : {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        investments : {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        ref_earn: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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

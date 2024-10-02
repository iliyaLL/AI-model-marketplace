// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint256 totalRating;
        uint256 ratingCount;
        bool purchased;
    }

    mapping(uint256 => Model) public models;
    mapping(address => uint256) public userFunds;
    mapping(address => uint256[]) public userPurchasedModels;
    uint256 public modelCount;

    event ModelListed(uint256 modelId, string name, address creator);
    event ModelPurchased(uint256 modelId, address buyer);
    event ModelRated(uint256 modelId, uint256 rating, address rater);
    event FundsWithdrawn(address owner, uint256 amount);
    event BalanceUpdated(address user, uint256 newBalance);
    event BalanceClaimed(address user, uint256 amount);

    function listModel(
        string memory name,
        string memory description,
        uint256 price
    ) public {
        require(bytes(name).length > 0, "The model name is empty");
        require(
            bytes(description).length > 0,
            "The model description is empty"
        );

        models[modelCount] = Model(
            name,
            description,
            price,
            payable(msg.sender),
            0,
            0,
            false
        );

        emit ModelListed(modelCount++, name, msg.sender);
    }

    function purchaseModel(uint256 modelId) public payable {
        Model storage model = models[modelId];

        require(
            model.creator != msg.sender,
            "The model's creator cannot buy its own model"
        );
        require(modelId >= 0 && modelId < modelCount, "Invalid model ID");
        require(model.purchased == false, "Model Already Purchased");
        require(msg.value == model.price, "Incorrect payment amount");

        userFunds[model.creator] += model.price;
        userPurchasedModels[msg.sender].push(modelId);
        model.purchased = true;

        emit ModelPurchased(modelId, msg.sender);
    }

    function rateModel(uint256 modelId, uint256 rating) public {
        Model storage model = models[modelId];
        bool hasPurchased = false;

        for (uint256 i = 0; i < userPurchasedModels[msg.sender].length; i++) {
            if (userPurchasedModels[msg.sender][i] == modelId) {
                hasPurchased = true;
                break;
            }
        }

        require(
            msg.sender != model.creator && hasPurchased,
            "A model cannot be rated by its creator or people who didn't purchase it."
        );
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        model.totalRating += rating;
        model.ratingCount++;

        emit ModelRated(modelId, rating, msg.sender);
    }

    function withdrawFunds() public {
        uint256 amount = userFunds[msg.sender];
        require(amount > 0, "No funds to withdraw");

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transaction error");

        userFunds[msg.sender] = 0;

        emit FundsWithdrawn(msg.sender, amount);
    }

    function getModelDetails(
        uint256 modelId
    )
        public
        view
        returns (string memory, string memory, uint256, address, bool, uint8)
    {
        Model storage model = models[modelId];
        uint8 averageRating = uint8(
            model.ratingCount > 0 ? model.totalRating / model.ratingCount : 0
        );
        return (
            model.name,
            model.description,
            model.price,
            model.creator,
            model.purchased,
            averageRating
        );
    }

    function getUserPurchasedModels() public view returns (uint256[] memory) {
        return userPurchasedModels[msg.sender];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CricketMatchData
 * @dev Smart contract for storing immutable cricket match data and no ball detection results
 */
contract CricketMatchData is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _matchIds;
    
    struct MatchData {
        uint256 matchId;
        string matchIdentifier;
        string team1;
        string team2;
        uint256 timestamp;
        uint256 totalBalls;
        uint256 noBalls;
        uint256 wideBalls;
        string venue;
        address recorder;
        bool verified;
    }
    
    struct DetectionResult {
        uint256 ballId;
        uint256 matchId;
        bool isNoBall;
        uint256 confidence; // Stored as percentage * 100 (e.g., 9570 = 95.70%)
        string ipfsHash; // Hash of the image stored on IPFS
        uint256 timestamp;
        address validator;
    }
    
    // Mappings
    mapping(uint256 => MatchData) public matches;
    mapping(uint256 => DetectionResult[]) public matchDetections;
    mapping(string => uint256) public matchIdentifierToId;
    mapping(address => bool) public authorizedValidators;
    
    // Events
    event MatchRecorded(
        uint256 indexed matchId,
        string matchIdentifier,
        string team1,
        string team2,
        uint256 totalBalls,
        uint256 noBalls
    );
    
    event DetectionRecorded(
        uint256 indexed matchId,
        uint256 indexed ballId,
        bool isNoBall,
        uint256 confidence,
        string ipfsHash
    );
    
    event MatchVerified(uint256 indexed matchId, address verifier);
    
    event ValidatorAuthorized(address validator, bool authorized);
    
    // Modifiers
    modifier onlyAuthorizedValidator() {
        require(authorizedValidators[msg.sender] || msg.sender == owner(), "Not authorized validator");
        _;
    }
    
    modifier validMatchId(uint256 matchId) {
        require(matchId <= _matchIds.current() && matchId > 0, "Invalid match ID");
        _;
    }
    
    constructor() {
        authorizedValidators[msg.sender] = true;
    }
    
    /**
     * @dev Record a new cricket match
     */
    function recordMatch(
        string memory _matchIdentifier,
        string memory _team1,
        string memory _team2,
        uint256 _totalBalls,
        uint256 _noBalls,
        uint256 _wideBalls,
        string memory _venue
    ) external onlyAuthorizedValidator nonReentrant returns (uint256) {
        require(bytes(_matchIdentifier).length > 0, "Match identifier required");
        require(matchIdentifierToId[_matchIdentifier] == 0, "Match already exists");
        require(_totalBalls > 0, "Total balls must be greater than 0");
        require(_noBalls <= _totalBalls, "No balls cannot exceed total balls");
        
        _matchIds.increment();
        uint256 newMatchId = _matchIds.current();
        
        matches[newMatchId] = MatchData({
            matchId: newMatchId,
            matchIdentifier: _matchIdentifier,
            team1: _team1,
            team2: _team2,
            timestamp: block.timestamp,
            totalBalls: _totalBalls,
            noBalls: _noBalls,
            wideBalls: _wideBalls,
            venue: _venue,
            recorder: msg.sender,
            verified: false
        });
        
        matchIdentifierToId[_matchIdentifier] = newMatchId;
        
        emit MatchRecorded(newMatchId, _matchIdentifier, _team1, _team2, _totalBalls, _noBalls);
        
        return newMatchId;
    }
    
    /**
     * @dev Record a detection result for a specific ball
     */
    function recordDetection(
        uint256 _matchId,
        uint256 _ballId,
        bool _isNoBall,
        uint256 _confidence,
        string memory _ipfsHash
    ) external onlyAuthorizedValidator validMatchId(_matchId) nonReentrant {
        require(_confidence <= 10000, "Confidence cannot exceed 100.00%");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        
        DetectionResult memory newDetection = DetectionResult({
            ballId: _ballId,
            matchId: _matchId,
            isNoBall: _isNoBall,
            confidence: _confidence,
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            validator: msg.sender
        });
        
        matchDetections[_matchId].push(newDetection);
        
        emit DetectionRecorded(_matchId, _ballId, _isNoBall, _confidence, _ipfsHash);
    }
    
    /**
     * @dev Verify a match (can only be done by owner or authorized validator)
     */
    function verifyMatch(uint256 _matchId) external onlyAuthorizedValidator validMatchId(_matchId) {
        matches[_matchId].verified = true;
        emit MatchVerified(_matchId, msg.sender);
    }
    
    /**
     * @dev Authorize or deauthorize a validator
     */
    function setValidatorAuthorization(address _validator, bool _authorized) external onlyOwner {
        authorizedValidators[_validator] = _authorized;
        emit ValidatorAuthorized(_validator, _authorized);
    }
    
    /**
     * @dev Get match data by ID
     */
    function getMatch(uint256 _matchId) external view validMatchId(_matchId) returns (MatchData memory) {
        return matches[_matchId];
    }
    
    /**
     * @dev Get match data by identifier
     */
    function getMatchByIdentifier(string memory _matchIdentifier) external view returns (MatchData memory) {
        uint256 matchId = matchIdentifierToId[_matchIdentifier];
        require(matchId > 0, "Match not found");
        return matches[matchId];
    }
    
    /**
     * @dev Get all detection results for a match
     */
    function getMatchDetections(uint256 _matchId) external view validMatchId(_matchId) returns (DetectionResult[] memory) {
        return matchDetections[_matchId];
    }
    
    /**
     * @dev Get detection results count for a match
     */
    function getDetectionCount(uint256 _matchId) external view validMatchId(_matchId) returns (uint256) {
        return matchDetections[_matchId].length;
    }
    
    /**
     * @dev Get current match count
     */
    function getCurrentMatchId() external view returns (uint256) {
        return _matchIds.current();
    }
    
    /**
     * @dev Get match statistics
     */
    function getMatchStats(uint256 _matchId) external view validMatchId(_matchId) returns (
        uint256 totalDetections,
        uint256 noBallDetections,
        uint256 legalDeliveries
    ) {
        DetectionResult[] memory detections = matchDetections[_matchId];
        totalDetections = detections.length;
        
        for (uint256 i = 0; i < detections.length; i++) {
            if (detections[i].isNoBall) {
                noBallDetections++;
            }
        }
        
        legalDeliveries = totalDetections - noBallDetections;
    }
}
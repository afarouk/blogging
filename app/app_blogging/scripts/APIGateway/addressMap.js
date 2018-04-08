/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            getbloggingQuestions: ['GET', '/blogging/retrieveFeed'],
            getbloggingQuestionByUUID:['GET','/blogging/retrieveQuestion'],
            getbloggingCategories: ['GET', '/blogging/retrieveCategories'],
            getbloggingTags: ['GET', '/blogging/retrieveHashTags'],
            createQuestion: ['POST', '/blogging/createPoll'],
            answerQuestion: ['POST', '/blogging/answerQuestion'],
            likeDislikePoll: ['POST', '/blogging/likeDislikePoll'],
            retrievePredictionForFulfillment: ['GET', '/blogging/retrievePredictionForFulfillment'],
            fulfillPrediction: ['PUT', '/blogging/fulfillPrediction'],

            retrieveBloggingParticipationSummary: ['GET', '/blogging/retrieveBloggingParticipationSummary'],

            retrieveCommentsOnBloggingQuestion: ['GET', '/communication/retrieveCommentsOnPostFromSASL'],
            sendMessageToSASL: ['POST', '/blogging/commentOnPostFromSASL'],
            deleteCommentOnPostFromSASL: ['DELETE' , '/communication/deleteCommentOnPostFromSASL'],
            flagCommentOnPostFromSASL: ['PUT' , '/communication/flagCommentOnPostFromSASL'],

            login: ['POST', '/authentication/login'],
            logout: ['GET', '/authentication/logout'],

            registerNewMember: ['POST', '/blogging/registerNewMemberViaPostBody'],
            getAuthenticationStatus: ['GET', '/authentication/getAuthenticationStatus'],
            registerNewMemberWithInvitationCode: ['POST', '/authentication/registerNewMemberWithInvitationCode'],
            createAnonymousUser: ['POST', '/authentication/registerAnonymousAdhocMember'],

            sendContactInfo: ['POST','/blogging/sendContactUsEmail'],

            sendPromoURLToEmail: ['GET', '/blogging/sendPollContestURLToEmail'],
            sendPromoURLToMobileviaSMS: ['GET', '/blogging/sendPollContestURLToMobileviaSMS'],

            createWNewPictureNewMetaData: ['POST', '/usersasl/createWNewPictureNewMetaData']

        };
    }
};

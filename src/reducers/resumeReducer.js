import {  createReducer } from '../utils';
import {  UPDATE_RESUME_WITH_SERVER_RESPONSE, DROP_BULLET, UPDATE_LOCAL_STATE, UPDATE_LOCAL_STATE_HEADER, UPDATE_LOCAL_STATE_FOOTER, UPDATE_LOCAL_STATE_SAVEPRINT, UPDATE_LOCAL_STATE_BLOCKS, MOVE_BLOCK, MOVE_BULLET } from 'constants/resumeConstants';
import Immutable from 'immutable';


// resumeState.resumeTitle is what the front end sees; req.body.resumeTitle is what the server sees.
const initialState = {
  resumeId: 1,
  resumeTitle: 'Resume Version Name',
  resumeTheme: 'Default',
  resumeHeader: {
    name: 'Full Name',
    profession: 'Profession',
    city: 'City',
    state: 'State',
    displayEmail: 'email@email.com',
    phone: '(124) 125-4737',
    webLinkedin: 'linkedin.com/myname',
    webOther: 'github.com/number23'
  },
  blockChildren: [{
    blockId: 1,
    companyName: 'Company Name',
    jobTitle: 'Bossman',
    years: '2015',
    location: 'San Francisco, CA',
    bulletChildren: [{
      bulletId: 1,
      text: 'My first bullet',
      parentBlockId: 1
    }, {
      bulletId: 2,
      text: 'Then I productionalized everything, like the Bossman that I am.',
      parentBlockId: 1
    }]
  }, {
    blockId: 2,
    companyName: 'Second Corp.',
    jobTitle: 'Lackey',
    years: '2014, 2013',
    location: 'San Francisco, CA',
    bulletChildren: [{
      bulletId: 3,
      text: 'I believe in sentences that end with punctuation',
      parentBlockId: 2
    }, {
      bulletId: 4,
      text: 'This is an inflexible belief.',
      parentBlockId: 2
    }]
  }, {
    blockId: 3,
    companyName: 'Third Chance',
    jobTitle: 'Intern',
    years: '2012-2011',
    location: 'San Francisco, CA',
    bulletChildren: [{
      bulletId: 5,
      text: 'Not a great life here, alas.',
      parentBlockId: 3
    }, {
      bulletId: 6,
      text: 'But I played with a lot of paperclips!',
      parentBlockId: 3
    }]
  }],
  resumeFooter: {
    school1: {
      name: 'School Name',
      degree: 'Degree',
      schoolEndYear: 'Year',
      location: 'City'
    },
    school2: {
      name: 'School Name',
      degree: 'Degree',
      schoolEndYear: 'Year',
      location: 'City'
    },
    personalStatement: 'Personal Statement / Hobbies'
  }
};


export default createReducer(initialState, {

  [UPDATE_LOCAL_STATE]: (state, payload) => {
    const newState = {};
    newState[payload.textFieldName] = payload.userInput;
    return Object.assign({}, state, newState);
  },

  [UPDATE_LOCAL_STATE_HEADER]: (state, payload) => {
    let newState = Object.assign({}, state);
    newState.resumeHeader[payload.textFieldName] = payload.userInput;
    return newState;
  },

  [UPDATE_LOCAL_STATE_FOOTER]: (state, payload) => {
    let newState = Object.assign({}, state);
    if (payload.textFieldName.slice(0,6) === 'school'){
      newState.resumeFooter[payload.textFieldName.slice(0,7)][payload.textFieldName.slice(8)] = payload.userInput;
    } else {
      newState.resumeFooter[payload.textFieldName] = payload.userInput;
    }
    return newState;
  },

  [UPDATE_LOCAL_STATE_SAVEPRINT]: (state, payload) => {
    let newState = Object.assign({}, state);
    newState[payload.textFieldName] = payload.userInput;
    return newState;
  },

  [UPDATE_LOCAL_STATE_BLOCKS]: (state, payload) => {
    // !!!!!!!
    // this funciton is definitely not correct yet, see Andrew's commit for truth?
    let newState = Object.assign({}, state);
    newState.blockChildren[0][payload.textFieldName] = payload.userInput;
    return newState;
  },

  [UPDATE_RESUME_WITH_SERVER_RESPONSE]: (state, payload) => {
    console.log(payload);
    return {
      ...state,
      ...payload
    };
  },

  // [DROP_BULLET]: (state, payload) => {
  //   // Can we just grab this.blockId from view?
  //   const targetIndex = () => {
  //     for (let index = 0; index < state.blockChildren.length; index++) {
  //       if (state.blockChildren[index].blockId === state.targetBlock.blockId) {
  //         return index;
  //       }
  //     }
  //   }();

  //   return Object.assign({}, state, {
  //     blockChildren: state.blockChildren,
  //     droppedBullet: state.blockChildren[targetIndex].body.push(state.droppedBullet.body)
  //   });
  // },

  [MOVE_BLOCK]: (state, payload) => {
    const immutableBlockChildren = Immutable.List(state.blockChildren);

    return Object.assign({}, state, {
      blockChildren: immutableBlockChildren.splice(payload.blockIndex, 1).splice(payload.atIndex, 0, payload.block).toJS()
    });
  },

  [MOVE_BULLET]: (state, payload) => {
    const parentBlock = payload.blockChildren[payload.parentBlockIndex];
    const immutableBulletChildren = Immutable.List(parentBlock.bulletChildren)
    const parentBlockIndex = payload.parentBlockIndex;

    let newState = Object.assign({}, state);
    newState.blockChildren[payload.parentBlockIndex].bulletChildren = immutableBulletChildren.splice(payload.bulletIndex, 1).splice(payload.atIndex, 0, payload.bullet);
    return newState;
  }
})

import fire from '../../fire';

/////////////////////
///// FIREBASE /////
/////////////////////

// **  Initializers **
  // Initializers are usually set on componentDidMount, they only need to be set once, and will
  // automatically update with a action dispatch whenever there is a change in that data
  // in firebase. For example, getMessages is initialized, and calls updateMessages whenever
  // there is a change in data.

export const getMessages = () => dispatch => {
  const firebaseMessageRef = fire.database().ref('messages').orderByKey().limitToLast(100);
  firebaseMessageRef.on('child_added', snapshot => {
    dispatch(updateMessages(snapshot))
  })
}

// Posts
export const addMessage = payload => dispatch => {
  fire.database().ref('messages').push( payload );
};

/////////////////////////////
///// Redux Actions /////////
/////////////////////////////

const updateMessages = payload => dispatch => {
  const message = { text: payload.val(), id: payload.key };
  dispatch({
    type: "UPDATE_MESSAGES",
    payload: message
  });
};

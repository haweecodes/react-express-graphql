import React from "react";
import gql from 'graphql-tag';
import { ApolloProvider , useMutation, useQuery } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import "./App.css";

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
});

const POST_POST = gql`
mutation SetPost($type: String) {
  setPost (post: $type) {
    post
  }
}
`;
const GET_POST = gql`
  {
    post
  }
`;

function HookCaller () {
  const {loading, error, data} = useQuery(GET_POST);
  const [setPost, newData] = useMutation(POST_POST);

  let input;
  let isUpdated = false;

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`

  let parsedData = JSON.parse(data.post)
  if(newData.data?.setPost?.post){
    isUpdated = true;
    setTimeout(()=>{
      isUpdated = false;
      window.location.reload();
    }, 3000);
  }
  return (
      <div className="main_wrapper">
        <div>
          <textarea rows="10" cols="100" defaultValue={parsedData} ref={node => {
            input = node;
          }} ></textarea>
        </div>
        <button onClick={()=>{
          setPost({variables: { type: input.value }})
        }}>Save</button>
        {isUpdated ? <p>Text Saved</p> : ''}
      </div>
    )
}

export default class App extends React.Component {
  state = {
    users: [],
  };

  render() {
    const { users } = this.state;
    return (
      <ApolloProvider client={client}>
        <div>
          <HookCaller />
        </div>
      </ApolloProvider>

    );
  }
}
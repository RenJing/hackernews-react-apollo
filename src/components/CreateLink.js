import React, {useState} from 'react'
import gql from 'graphql-tag'
import {useMutation} from 'react-apollo'
import {useHistory} from "react-router";
import {LINKS_PER_PAGE} from "../constants";
import {FEED_QUERY} from "./LinkList";

export const CreateLink = () => {
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')
    let history = useHistory();
    
    const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`
    const [addPost, {data}] = useMutation(POST_MUTATION, {
        update: (cache, { data: { post } }) => {
            const take = LINKS_PER_PAGE;
            const skip = 0;
            const orderBy = { createdAt: 'desc' };

            const data = cache.readQuery({
                query: FEED_QUERY,
                variables: {
                    take,
                    skip,
                    orderBy
                }
            });

            cache.writeQuery({
                query: FEED_QUERY,
                data: {
                    feed: {
                        links: [post, ...data.feed.links]
                    }
                },
                variables: {
                    take,
                    skip,
                    orderBy
                }
            });
        },
        onCompleted() {
            history.push('/')
        }}
    )
    
    const submit = (e) => {
        e.preventDefault();
        addPost({ variables: { url, description } })
        setDescription('')
        setUrl('')
    }

    return (
        <div>
            <div className="flex flex-column mt3">
                <input
                    className="mb2"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    type="text"
                    placeholder="A description for the link"
                />
                <input
                    className="mb2"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    type="text"
                    placeholder="The URL for the link"
                />
            </div>
            <button onClick={e => submit(e)}>Submit</button>
        </div>
    )
}
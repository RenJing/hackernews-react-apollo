import React from 'react'
import {Link} from './Link'
import {useQuery} from 'react-apollo'
import gql from 'graphql-tag'

export const LinkList = () => {
    const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`
    const {loading, error, data} = useQuery(FEED_QUERY);
    if (loading) return <div>Fetching</div>
    if (error) return <div>Error</div>

    const linksToRender = data.feed.links
    return linksToRender.map(link => <Link key={link.id} link={link}/>)
};
import React from 'react'
import {Link} from './Link'
import { useQuery, gql } from '@apollo/client';

export const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

export const LinkList = () => {
    const {loading, error, data} = useQuery(FEED_QUERY, {
    });
    if (loading) return <div>Fetching</div>
    if (error) return <div>Error</div>

    return (
        <div>
            {data && (
                <>
                    {data.feed.links.map((link, index) => (
                        <Link key={link.id} link={link} index={index} />
                    ))}
                </>
            )}
        </div>
    );
};
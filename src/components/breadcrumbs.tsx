
import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";

type Props = {
  currentPath: string[],
};

const Break = styled.div`
  padding-right: 10px;
  padding-left: 10px;
`;

const History = styled(Link)`
  box-shadow: none;
`;

const Flex = styled.div`
  display: flex;
`;

export const Breadcrumbs = (props: Props) => {
  let linkPath = "";
  console.log("Breadcrumb props: ", props)

  const lastPage =
    props.currentPath.length > 0 ? props.currentPath.length - 1 : 0;

  return (
    <Flex>
      {props.currentPath.map((page, index) => {
        linkPath = [linkPath, page].join("/");

        // If your home url is not /, you do not need the blowing
        page = page === "/" ? "home" : page;

        return (
          <div>
            {index !== lastPage ? (
              <Flex>
                <History to={linkPath}>{page}</History>
                <Break>></Break>
              </Flex>
            ) : (
              <div>{page}</div>
            )}
          </div>
        );
      })}
    </Flex>
  );
};
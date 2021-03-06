import Layout from '../../components/Layout';
import SearchBar from '../../components/Common/Search';
import ItemList from '../../components/Meeting/ItemList';

import Button from '@mui/material/Button';
import styled from '@emotion/styled';

import Router from 'next/router';
import Head from 'next/head';

export default function Meeting() {
  const ItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: left;
  `;

  const MeetingActions = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `;

  const CusButton = styled(Button)`
    height: fit-content;
  `;

  return (
    <Layout>
      <Head>
        <title>미팅룸 | 싸피사만코</title>
      </Head>
      <h1 style={{ marginTop: '20px' }}>미팅룸</h1>
      <ItemWrapper>
        <MeetingActions>
          <SearchBar target="meeting"></SearchBar>
          <CusButton
            variant="outlined"
            size="medium"
            onClick={() => {
              Router.replace('/meeting/regist');
            }}
          >
            등록
          </CusButton>
        </MeetingActions>
        <ItemList></ItemList>
      </ItemWrapper>
    </Layout>
  );
}

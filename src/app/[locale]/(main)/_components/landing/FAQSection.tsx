'use client';

import styled from 'styled-components';
import {
  SectionInner,
  SectionWrap,
  SerifH2,
} from './_shared';

interface Props {
  dict: {
    title: string;
    subtitle: string;
    items: Array<{ q: string; a: string }>;
  };
}

const List = styled.div`
  margin-top: 48px;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Item = styled.details`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &[open] summary::after {
    transform: rotate(45deg);
  }
  &[open] > div {
    opacity: 1;
    max-height: 600px;
    padding: 0 4px 22px;
  }
`;

const Summary = styled.summary`
  list-style: none;
  cursor: pointer;
  padding: 24px 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  font-size: 19px;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.2s;

  &::-webkit-details-marker {
    display: none;
  }
  &::after {
    content: '+';
    font-family: ${({ theme }) => theme.fonts.body};
    font-weight: 400;
    font-size: 24px;
    color: ${({ theme }) => theme.colors.textMuted};
    transition: transform 0.25s ease;
  }
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Answer = styled.div`
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  padding: 0 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.7;
  transition: opacity 0.2s ease, max-height 0.3s ease, padding 0.2s ease;
`;

export function FAQSection({ dict }: Props) {
  return (
    <SectionWrap id="faq">
      <SectionInner>
        <SerifH2 $large>{dict.title}</SerifH2>

        <List>
          {dict.items.map((item, i) => (
            <Item key={i}>
              <Summary>{item.q}</Summary>
              <Answer>{item.a}</Answer>
            </Item>
          ))}
        </List>
      </SectionInner>
    </SectionWrap>
  );
}

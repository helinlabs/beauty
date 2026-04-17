'use client';

import styled from 'styled-components';
import { FadeIn } from './FadeIn';
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

/* Center "Common questions" heading above the list. */
const Title = styled(SerifH2)`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`;

/* List is centered horizontally within the section so the FAQ
 * stack reads as a single centered column rather than hugging the
 * left edge of the 1200px content rail. */
const List = styled.div`
  margin: 48px auto 0;
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
  /* Body sans (Inter Tight) instead of the serif heading face so the
   * questions read as clean, neutral text rather than editorial. */
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  font-size: 18px;
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
    /* Primary (terracotta) instead of muted grey, no shadow or filter
     * so the glyph reads as a clean flat accent. */
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: none;
    filter: none;
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
        <FadeIn>
          <Title $large>{dict.title}</Title>
        </FadeIn>

        <List>
          {dict.items.map((item, i) => (
            <FadeIn key={i} delay={i * 60}>
              <Item>
                <Summary>{item.q}</Summary>
                <Answer>{item.a}</Answer>
              </Item>
            </FadeIn>
          ))}
        </List>
      </SectionInner>
    </SectionWrap>
  );
}

import { encode } from 'gpt-tokenizer/model/gpt-4o';

export function calculateInputCost(text) {
  const tokens = encode(text);
  const cost = (tokens.length / 1000000) * 0.15;
  return cost;
}

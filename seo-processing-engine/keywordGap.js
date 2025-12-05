// Renamed functions to use standard camelCase for better practice

export function getKeywordGaps(clientKeywords = [], competitorKeywords = []) {
    // Keywords competitors rank for but the client does not
    const gaps = competitorKeywords.filter(
        kw => !clientKeywords.includes(kw)
    );
    
    return gaps;
}

export function getClientAdvantages(clientKeywords = [], competitorKeywords = []) {
    // Keywords client ranks for but the competitor does not
    return clientKeywords.filter( 
        kw => !competitorKeywords.includes(kw)
    );
}

export type MolluskScannedDetails = {
    mollusk_name: string,
    scientific_name: string
    description: string,
    status: string
}


export type REPORT_DETAILS = {
    longitude: number
    latitude: number
    city: string
    province: string
    street: string
    durian_disease_type: string
    user_id: number
}


export type ReportedCasesTypes = {
    report_id: number
    longitude: number,
    latitude: number,
    city: string,
    province: string,
    street: string,
    reportedAt: string
    durian_disease_type: string
    
    user_id: number
    status: string

    reporter_address: string
    reporter_name: string

}


export type RegionType = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}
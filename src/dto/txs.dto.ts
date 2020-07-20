import { IsString, IsInt, Length , Min, Max ,IsOptional, Equals, MinLength, ArrayNotEmpty} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {BaseReqDto, BaseResDto, PagingReqDto} from './base.dto';
import {ApiError} from '../api/ApiResult';
import {ErrorCodes} from '../api/ResultCodes';

/************************   request dto   ***************************/
//txs request dto
export class TxListReqDto extends PagingReqDto{
	@ApiPropertyOptional()
	type?: string;

    @ApiPropertyOptional({description:'1:success  2:fail'})
    status?: string;

    @ApiPropertyOptional()
    beginTime?: string;

    @ApiPropertyOptional()
    endTime?: string;

    static validate(value:any){
      	super.validate(value);
		if (value.status && value.status !=='1' && value.status !=='2') {
			throw new ApiError(ErrorCodes.InvalidParameter, 'status must be 1 or 2');
		}
	}
}

//txs/blocks request dto
export class TxListWithHeightReqDto extends PagingReqDto{
	@ApiPropertyOptional()
    height?: string;
}

//txs/addresses request dto
export class TxListWithAddressReqDto extends PagingReqDto{
	@ApiPropertyOptional()
    address?: string;

    @ApiPropertyOptional()
    type?: string;

    @ApiPropertyOptional({description:'1:success  2:fail'})
    status?: string;

    static validate(value:any){
        super.validate(value);
        if (value.status && value.status !=='1' && value.status !=='2') {
            throw new ApiError(ErrorCodes.InvalidParameter, 'status must be 1 or 2');
        }
    }
}

// txs/relevance 
export class TxListWithContextIdReqDto extends PagingReqDto{
    @ApiPropertyOptional()
    contextId?: string;

    @ApiPropertyOptional()
    type?: string;

    @ApiPropertyOptional({description:'1:success  2:fail'})
    status?: string;

    static validate(value:any){
        super.validate(value);
        if (value.status && value.status !=='1' && value.status !=='2') {
            throw new ApiError(ErrorCodes.InvalidParameter, 'status must be 1 or 2');
        }
    }
}

//txs/nfts request dto
export class TxListWithNftReqDto extends PagingReqDto{
	@ApiPropertyOptional()
    denom?: string;

    @ApiPropertyOptional()
	tokenId?: string;
}

//txs/services request dto
export class TxListWithServicesNameReqDto extends PagingReqDto{
	@ApiPropertyOptional()
    serviceName?: string;
}

//txs/services/detail/{serviceName} request dto
export class ServicesDetailReqDto extends BaseReqDto{
	@ApiProperty()
    serviceName: string;
}

//txs/service/call-service
export class TxListWithCallServiceReqDto extends PagingReqDto{
    @ApiProperty()
    @MinLength(1, {message: "consumerAddr is too short"})
    consumerAddr: string;
}

//txs/service/respond-service
export class TxListWithRespondServiceReqDto extends PagingReqDto{
    @ApiProperty()
    @MinLength(1, {message: "providerAddr is too short"})
    providerAddr: string;
}

//Post txs/types request dto
export class PostTxTypesReqDto extends BaseReqDto{
    @ApiProperty()
    @ArrayNotEmpty()
    typeNames: Array<string>;
}

//put txs/types request dto
export class PutTxTypesReqDto extends BaseReqDto{
    @ApiProperty()
    @MinLength(1, {message: "typeName is too short"})
    typeName: string;

    @ApiProperty()
    @MinLength(1, {message: "newTypeName is too short"})
    newTypeName: string;
}

//Delete txs/types request dto
export class DeleteTxTypesReqDto extends BaseReqDto{
    @ApiProperty()
    @MinLength(1, {message: "typeName is too short"})
    typeName: string;
}

//txs/{hash} request dto
export class TxWithHashReqDto extends BaseReqDto{
    @ApiProperty()
	hash: string;
}


/************************   response dto   ***************************/
//txs response dto
export class TxResDto extends BaseResDto{
	time: string;
 	height: string;
  	tx_hash: string;
  	memo: string;
  	status: number;
  	log: string;
  	complex_msg: boolean;
  	type: string;
  	from: string;
  	to: string;
  	coins: Array<any>;
  	signer: string;
  	events: Array<any>;
  	msgs: Array<any>;
  	signers: Array<any>;

    constructor(txData){
      	super();
      	this.time = txData.time;
		this.height = txData.height;
		this.tx_hash = txData.tx_hash;
		this.memo = txData.memo;
		this.status = txData.status;
		this.log = txData.log;
		this.complex_msg = txData.complex_msg;
		this.type = txData.type;
		this.from = txData.from;
		this.to = txData.to;
		this.coins = txData.coins;
		this.signer = txData.signer;
		this.events = txData.events;
		this.msgs = txData.msgs;
		this.signers = txData.signers;
    }

    static bundleData(value:any):TxResDto[]{
      	let data:TxResDto[] = [];
      	data = value.map((v:any)=>{
      		return new TxResDto(v);
      	});
      	return data;
    }
}

//txs/service/call-service
export class callServiceResDto extends TxResDto{
    respond: TxResDto[];

    constructor(txData){
        super(txData);
        if (txData.respond && txData.respond.length) {
            this.respond = (txData.respond || []).map((item)=>{
                return new TxResDto(item);
            });
        }
    }

    static bundleData(value:any):callServiceResDto[]{
        let data:callServiceResDto[] = [];
        data = value.map((v:any)=>{
            return new callServiceResDto(v);
        });
        return data;
    }
}

//txs/service/respond-service
export class RespondServiceResDto extends TxResDto{
    respond_times: number;

    constructor(txData){
        super(txData);
        this.respond_times = txData.respond_times;
    }

    static bundleData(value:any):RespondServiceResDto[]{
        let data:RespondServiceResDto[] = [];
        data = value.map((v:any)=>{
            return new RespondServiceResDto(v);
        });
        return data;
    }
}

//txs/types response dto
export class TxTypeResDto extends BaseResDto{
    typeName: string;

    constructor(typeData){
        super();
        this.typeName = typeData.type_name;
    }

    static bundleData(value:any):TxTypeResDto[]{
        let data:TxTypeResDto[] = [];
        data = value.map((v:any)=>{
            return new TxTypeResDto(v);
        });
        return data;
    }
}
